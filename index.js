'use strict';

import requireDir from 'require-dir';
import { default as GithubTaskManager } from 'github-task-manager';

// load custom plugins
requireDir('./src/executors');
requireDir('./src/handlers');

(() => {

    let agent = new GithubTaskManager.Agent();
    agent.start();

})();
