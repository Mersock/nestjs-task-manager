import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { Tasks } from './tasks.entity';
import { TaskStatus } from './tasks-status.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filter: GetTasksFilterDto): Promise<Tasks[]> {
    return this.tasksService.getTasks(filter);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Tasks> {
    return this.tasksService.getTasksById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTasks(@Body() createTaskDto: CreateTaskDto): Promise<Tasks> {
    return this.tasksService.createTasks(createTaskDto);
  }

  @Delete('/:id')
  deleteTasks(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deteteTasks(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Tasks> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
