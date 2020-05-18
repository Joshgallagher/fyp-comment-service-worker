import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Comment } from './schemas/comment.schema';
import { DiscoveryService } from '@nestjs/core';
import { Model, DocumentQuery, Query } from 'mongoose';
import { createMock } from '@golevelup/nestjs-testing';

describe('WorkerService', () => {
  let service: WorkerService;
  let model: Model<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigModule,
        DiscoveryService,
        AmqpConnection,
        RabbitMQModule,
        WorkerService,
        {
          provide: getModelToken('Comment'),
          useValue: {
            constructor: jest.fn(),
            deleteMany: jest.fn(),
            countDocuments: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
    model = module.get<Model<Comment>>(getModelToken(Comment.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteCommentsHandler', () => {
    const data: Record<string, number> = { id: 1 };

    it('Comments can be deleted if one or more exist', async () => {
      jest.spyOn(model, 'countDocuments').mockReturnValueOnce(
        createMock<Query<number>>({
          exec: jest.fn().mockResolvedValueOnce(4)
        })
      );

      await service.deleteCommentsHandler(data);

      expect(model.countDocuments).toHaveBeenCalledWith({ article_id: data.id });
      expect(model.deleteMany).toHaveBeenCalledWith({ article_id: data.id });
    });

    it('Comments can not be deleted if none exist', async () => {
      jest.spyOn(model, 'countDocuments').mockReturnValueOnce(
        createMock<Query<number>>({
          exec: jest.fn().mockResolvedValueOnce(0)
        })
      );

      await service.deleteCommentsHandler(data);

      expect(model.countDocuments).toHaveBeenCalledWith({ article_id: data.id });
      expect(model.deleteMany).toHaveBeenCalledTimes(0);
    });
  });
});
