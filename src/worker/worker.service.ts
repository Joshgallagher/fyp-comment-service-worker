import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class WorkerService {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<Comment>
    ) { }

    @RabbitSubscribe({
        exchange: 'article.exchange',
        routingKey: 'article.deleted',
        queue: 'article-queue'
    })
    async deleteCommentsHandler(
        { id }: Record<string, number>
    ): Promise<void> {
        const commentCount = await this.commentModel
            .countDocuments({ article_id: id })
            .exec();

        if (commentCount > 0) {
            await this.commentModel.deleteMany({ article_id: id });
        }
    }
}
