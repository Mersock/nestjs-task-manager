import { EntityRepository, Repository } from 'typeorm';
import { Tasks } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Tasks)
export class TasksRepository extends Repository<Tasks> {
  async getTasks(filterDto: GetTasksFilterDto): Promise<Tasks[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('tasks');

    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'tasks.title LIKE :search OR tasks.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTasks(createTasksDto: CreateTaskDto): Promise<Tasks> {
    const { title, description } = createTasksDto;
    const task = new Tasks();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
}
