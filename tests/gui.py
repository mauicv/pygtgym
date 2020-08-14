import os
import sys
from tqdm import tqdm
sys.path.insert(1, os.getcwd())
from src import make # noqa


def test_gui():
    env = make('gt-stander')
    env.reset()
    for i in range(1000):
        _, _, d, _ = env.step(list(range(6)))
        env.render()
    env.close()
    assert d


if __name__ == '__main__':
    for func in tqdm([test_gui]):
        func()
