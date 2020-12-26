import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const mockCredentialDto = {
  username: 'TestUsername',
  password: 'TestPassword',
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        userRepository.signUp(mockCredentialDto),
      ).resolves.not.toThrow();
    });

    it('throw sign up user already', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throw error exception', async () => {
      save.mockRejectedValue({ code: '123123' });
      await expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    describe('validateUserPassword', () => {
      let user;

      beforeEach(() => {
        userRepository.findOne = jest.fn();
        user = new User();
        user.username = 'TestUsername';
        user.validatePassword = jest.fn();
      });

      it('return username and validate is successful', async () => {
        userRepository.findOne.mockResolvedValue(user);
        user.validatePassword.mockResolvedValue(true);
        const result = await userRepository.validateUserPassword(
          mockCredentialDto,
        );
        expect(result).toEqual('TestUsername');
      });
      it('return null as user cannot found', async () => {
        userRepository.findOne.mockResolvedValue(null);
        const result = await userRepository.validateUserPassword(
          mockCredentialDto,
        );
        expect(user.validatePassword).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });
      it('return null as password is invalid', async () => {
        userRepository.findOne.mockResolvedValue(user);
        user.validatePassword.mockResolvedValue(false);
        const result = await userRepository.validateUserPassword(
          mockCredentialDto,
        );
        expect(user.validatePassword).toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });

    describe('hashPassword', () => {
      it('call becrpt.hash to generate a hash', async () => {
        bcrypt.hash = jest.fn().mockResolvedValue('testHash');
        expect(bcrypt.hash).not.toHaveBeenCalled();
        const result = await userRepository.hashPassword(
          'testPassword',
          'testSalt',
        );
        expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
        expect(result).toEqual('testHash');
      });
    });
  });
});
