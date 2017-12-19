import { EventHandler, Executor, AgentUtils } from 'github-task-manager';
let log = AgentUtils.logger();

export class EventHandlerSample extends EventHandler {
    async handleEvent() {
        let supportedActions = ['sample'];

        if (!supportedActions.includes(this.eventData.action)) {
            log.error(`Unsupported Action: '${this.eventData.action}'`);
            return;
        }

        log.info('---------------------------------');
        log.info('Repository Name: ' + this.eventData.repository.name);
        log.info('Pull Request: ' + this.eventData.pull_request.number);
        log.info('---------------------------------');

        this.tasks = AgentUtils.templateReplace(
            AgentUtils.createBasicTemplate(this.eventData),
            this.tasks
        );

        return this.processTasks(this);
    }

    async processTasks(event) {
        let promises = [];

        event.tasks.forEach(async task => {
            if (!Executor.isRegistered(task.executor)) {
                return;
            }
            log.info('=================================');
            log.info(
                'Creating Executor for Task: ' +
                    task.executor +
                    ':' +
                    task.context
            );
            let executor = Executor.create(task.executor, event.eventData);

            let status;
            let taskPromise;

            try {
                taskPromise = executor
                    .executeTask(task)
                    .then(taskResult => {
                        if (taskResult === 'NO_MATCHING_TASK') {
                            status = AgentUtils.createStatus(
                                event.eventData,
                                'error',
                                `${task.executor}: ${task.context}`,
                                'Unknown Task Type: ' + task.context,
                                'https://urlWithDetails'
                            );
                        } else {
                            let defaultResultMessage = taskResult.passed
                                ? 'Task Completed Successfully'
                                : 'Task Completed with Errors';
                            let taskResultMessage =
                                taskResult.message || defaultResultMessage;
                            status = AgentUtils.createStatus(
                                event.eventData,
                                taskResult.passed ? 'success' : 'error',
                                `${task.executor}: ${task.context}`,
                                taskResultMessage,
                                taskResult.url
                            );
                        }
                        return status;
                    })
                    .then(status => {
                        let logFn =
                            status.state === 'success' ? log.info : log.error;
                        return logFn(
                            process.env.GTM_SQS_RESULTS_QUEUE,
                            status,
                            process.env.GTM_SNS_RESULTS_TOPIC,
                            `Result '${status.state}' for ${
                                event.eventType
                            } => ${task.executor}:${task.context} - Event ID: ${
                                event.eventId
                            }`
                        );
                    })
                    .catch(() => {
                        status = AgentUtils.createStatus(
                            event.eventData,
                            'error',
                            task.context,
                            'Task execution failure'
                        );

                        return log.error(
                            process.env.GTM_SQS_RESULTS_QUEUE,
                            status,
                            process.env.GTM_SNS_RESULTS_TOPIC,
                            `Result 'error' for ${event.eventType} => ${
                                task.executor
                            }:${task.context} - Event ID: ${event.eventId}`
                        );
                    });
            } catch (e) {
                taskPromise = Promise.reject(e.message);
            }

            promises.push(taskPromise);
        });

        return Promise.all(promises);
    }
}

EventHandler.register('sample', EventHandlerSample);
