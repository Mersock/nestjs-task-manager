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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filter: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Tasks[]> {
    return this.tasksService.getTasks(filter, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Tasks> {
    return this.tasksService.getTasksById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTasks(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Tasks> {
    return this.tasksService.createTasks(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTasks(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deteteTasks(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Tasks> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
