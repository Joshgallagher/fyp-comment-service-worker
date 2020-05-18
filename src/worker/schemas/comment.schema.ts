import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
    @Prop()
    article_id: Number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
