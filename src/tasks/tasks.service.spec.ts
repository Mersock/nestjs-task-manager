import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './tasks-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 1,
  username: 'Test User',
};

const mockTasksRepositoty = {
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTasks: jest.fn(),
  delete: jest.fn(),
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

  describe('getTasksById', () => {
    it('call tasks repository findOne() return successfuly', async () => {
      const mockTasks = {
        title: 'Test tasks',
        description: 'test desc',
      };
      tasksRepository.findOne.mockResolvedValue(mockTasks);
      const result = await tasksService.getTasksById(1, mockUser);
      expect(result).toEqual(mockTasks);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws error tasks not found', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTasksById(1, mockUser)).rejects.toThrow();
      expect(tasksService.getTasksById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTasks', () => {
    it('call tasks repository create() ', async () => {
      tasksRepository.createTasks.mockResolvedValue('test');
      expect(tasksRepository.createTasks).not.toHaveBeenCalled();
      const mockTasks = {
        title: 'Test tasks',
        description: 'test desc',
      };
      const result = await tasksService.createTasks(mockTasks, mockUser);
      expect(tasksRepository.createTasks).toHaveBeenCalledWith(
        mockTasks,
        mockUser,
      );
      expect(result).toEqual('test');
    });
  });

  describe('deleteTasks', () => {
    it('call taskRepository deleteTasks()', async () => {
      const mockTasks = {
        id: 1,
        userId: mockUser.id,
      };
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      expect(tasksRepository.delete).not.toHaveBeenCalled();
      await tasksService.deteteTasks(1, mockUser);
      expect(tasksRepository.delete).toHaveBeenCalledWith(mockTasks);
    });

    it('throws taskRepository deleteTasks()', () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deteteTasks(1, mockUser)).rejects.toThrow();
      expect(tasksService.deteteTasks(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
