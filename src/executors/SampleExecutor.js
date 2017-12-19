import { Executor, AgentUtils } from 'github-task-manager';

let log = AgentUtils.logger();

/**
 * Sample .githubTaskManager.json task config
 * {
    "executor": "Sample",
    "context": "test",
    "options": {
       "something": "somethingControllingExecution"
    }
  }
 */

export class ExecutorSample extends Executor {
    constructor(eventData) {
        super(eventData);
        this.options = this.getOptions();
    }

    async executeTask(task) {
        let something = task.options.something;

        log.info(`Starting sample execution with ${something}..`);

        return new Promise(async (resolve, reject) => {
            if (this.process(task)) {
                resolve({
                    passed: true,
                    message: 'Execution completed',
                    url: 'https://someUrlWithDetail'
                });
            } else {
                reject({
                    passed: false,
                    message: 'Execution error',
                    url: 'https://someUrlWithDetail'
                });
            }
        });
    }

    process(task) {
        log.info(task);

        return true;
    }
}

Executor.register('Sample', ExecutorSample);
