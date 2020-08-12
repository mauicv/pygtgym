from subprocess import Popen, PIPE
import json


def make(env_name):
    return Env(env_name)


class Env:
    def __init__(self, name):
        self.ps = Popen(
                ['nodejs', 'src/js/index.js'],
                stdin=PIPE, stdout=PIPE)
        self.name = name
        self.make(name)

    def _call(self, cmd, args):
        cmd_dict = {
            'cmd': cmd,
            'args': args
        }
        cmd_dict_str = json.dumps(cmd_dict)
        data = cmd_dict_str.encode()
        self.ps.stdin.write(data)
        self.ps.stdin.flush()
        out = self.ps.stdout.readline()
        return json.loads(out)

    def make(self, name):
        r = self._call('make', name)
        self.action_space = r['action_space']
        self.observation_space = r['observation_space']

    def reset(self):
        return self._call('reset', None)

    def step(self, action):
        return self._call('step', action)
