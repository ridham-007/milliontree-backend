// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreeController } from './tree.controller';
import { Tree, TreeSchema } from './tree.schema';
import { TreeService } from './tree.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tree.name, schema: TreeSchema }]),
    TreeModule
  ],
  providers: [TreeService],
  controllers: [TreeController],
  exports: [TreeService],

})
export class TreeModule {}
