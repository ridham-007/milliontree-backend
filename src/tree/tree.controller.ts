import { Controller, Get, Post, Body, Param, Patch, Delete} from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { Tree } from './tree.schema';
import { TreeService } from './tree.service';

@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Public()
  @Post('/register')
  create(@Body() tree: Tree) {
    return this.treeService.create(tree);
  }

  @Public()
  @Delete('/:id')
  deleteUserById(@Param('id') id: string) {
    return this.treeService.deleteTreeById(id);
  }
 
  @Public()
  @Patch('/update/:id')
  update(@Param() { id }, @Body() tree: Tree) {
    return this.treeService.update(id, tree);
  }

  @Public()
  @Get('/planted-trees')
  getPlantedTrees() {
    return this.treeService.getPlantedTrees();
  }
  
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.treeService.findById(id);
  }
}
