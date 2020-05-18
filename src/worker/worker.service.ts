import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class WorkerService {
    @RabbitSubscribe({
        exchange: 'article.exchange',
        routingKey: 'article.deleted',
        queue: 'article-queue'
    })
    async deleteCommentsHandler(
        { id }: Record<string, number>
    ): Promise<void> {
        console.log(`Article ID: ${id}`);
    }
}
