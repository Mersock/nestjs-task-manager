import { EntityRepository, Repository } from 'typeorm';
import { Tasks } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Tasks)
export class TasksRepository extends Repository<Tasks> {
  private logger = new Logger('TasksRepository');
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Tasks[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('tasks');

    query.where('tasks.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'tasks.title LIKE :search OR tasks.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${user.username} DTO: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTasks(createTasksDto: CreateTaskDto, user: User): Promise<Tasks> {
    const { title, description } = createTasksDto;
    const task = new Tasks();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create task for user ${user.username}. Data: ${createTasksDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }
}
