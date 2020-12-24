class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.annouceFriendship(name);
  }

  annouceFriendship(name) {
    global.console.log(`${name} is now a friend`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);
    if (idx === -1) {
      throw new Error('Not found');
    }
    this.friends.splice(idx, 1);
  }
}

describe('FriendsList', () => {
  let friendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('init friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('add a frend to list', () => {
    friendsList.addFriend('b');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('annouce ship friend ship ', () => {
    friendsList.annouceFriendship = jest.fn();
    expect(friendsList.annouceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('b');
    expect(friendsList.annouceFriendship).toHaveBeenCalledWith('b');
  });

  describe('removeFriend', () => {
    it('remvoe from list', () => {
      friendsList.addFriend('aa');
      expect(friendsList.friends[0]).toEqual('aa');
      friendsList.removeFriend('aa');
      expect(friendsList.friends[0]).toBeUndefined();
    });
    it('throws an error', () => {
      expect(() => friendsList.removeFriend('aa')).toThrow(
        new Error('Not found'),
      );
    });
  });
});
