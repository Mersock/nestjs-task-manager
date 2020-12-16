import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './tasks-status.enum';
import { Tasks } from './tasks.entity';
import { TasksRepository } from './tasks.repository';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Tasks[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTasksById(id: number): Promise<Tasks> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTasks(createTaskDto: CreateTaskDto): Promise<Tasks> {
    return this.tasksRepository.createTasks(createTaskDto);
  }

  async deteteTasks(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Tasks> {
    const tasks = await this.getTasksById(id);
    tasks.status = status;
    await tasks.save();
    return tasks;
  }
}
