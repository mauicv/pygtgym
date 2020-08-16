import os
import sys
sys.path.insert(1, os.getcwd())
from src import make # noqa


def test_gui():
    env = make('gt-stander')
    env.reset()
    for i in range(1001):
        _, _, d, _ = env.step([0.1, 0, 0, 0, 0, 0])
        env.render()
    env.close()
    assert d


if __name__ == '__main__':
    for func in [test_gui]:
        func()
