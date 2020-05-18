import { Module } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [WorkerModule],
  providers: [],
})
export class AppModule { }
