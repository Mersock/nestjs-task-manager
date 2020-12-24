import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './tasks-status.enum';

const mockUser = {
  username: 'Test User',
};

const mockTasksRepositoty = {
  getTasks: jest.fn(),
};

describe('TasksService', () => {
  let tasksService;
  let tasksRepository;

  /**
   * init
   */
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: mockTasksRepositoty },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    tasksRepository = await module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('get all tasks', async () => {
      tasksRepository.getTasks.mockResolvedValue('test');
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'a',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('test');
    });
  });
});
