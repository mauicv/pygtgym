import os
import sys
sys.path.insert(1, os.getcwd())
from src import make # noqa


def test_make():
    env = make('gt-stander')
    assert env.action_space == 6
    assert env.observation_space == 7


def test_reset():
    env = make('gt-stander')
    state = env.reset()
    assert state == [0, 0, 0, 0, 0, 0, 0.145]


def test_step():
    env = make('gt-stander')
    env.reset()
    s, r, d, _ = env.step([1, 1, 3, 4, 3, 2])

    assert s == [
        0.00020630209110983344,
        -0.0034787412107406546,
        -0.023086501598759135,
        -0.03618570138655475,
        -0.015439936939840582,
        -0.02179906336583981,
        0.14537508111383177
        ]
    assert r == 0.7533133889667704
    assert not d
    assert not _


def test_run():
    env = make('gt-stander')
    env.reset()
    for i in range(1001):
        _, _, d, _ = env.step(list(range(6)))
    assert d


if __name__ == '__main__':
    for func in [test_make, test_reset, test_step, test_run]:
        func()
