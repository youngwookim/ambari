/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var App = require('app');
var date = require('utils/date');

App.MainDashboardServiceYARNView = App.MainDashboardServiceView.extend({
  templateName: require('templates/main/dashboard/service/yarn'),
  serviceName: 'YARN',

  nodeWebUrl: function () {
    return "http://" + this.get('service.resourceManagerNode').get('publicHostName') + ":8088";
  }.property('service.resourceManagerNode'),

  nodeHeap: function () {
    var memUsed = this.get('service').get('jvmMemoryHeapUsed') * 1000000;
    var memCommitted = this.get('service').get('jvmMemoryHeapCommitted') * 1000000;
    var percent = memCommitted > 0 ? ((100 * memUsed) / memCommitted) : 0;
    return this.t('dashboard.services.hdfs.nodes.heapUsed').format(memUsed.bytesToSize(1, 'parseFloat'), memCommitted.bytesToSize(1, 'parseFloat'), percent.toFixed(1));

  }.property('service.jvmMemoryHeapUsed', 'service.jvmMemoryHeapCommitted'),

  summaryHeader: function () {
    var text = this.t("dashboard.services.yarn.summary");
    var svc = this.get('service');
    var totalCount = svc.get('nodeManagerNodes').get('length');
    return text.format(totalCount, totalCount);
  }.property('service.nodeManagerNodes'),
  
  nodeManagerComponent: function () {
    return App.HostComponent.find().findProperty('componentName', 'NODEMANAGER');
  }.property(),
  
  yarnClientComponent: function () {
    return App.HostComponent.find().findProperty('componentName', 'YARN_CLIENT');
  }.property(),
  
  nodeUptime: function () {
    var uptime = this.get('service').get('resourceManagerStartTime');
    if (uptime && uptime > 0){
      var diff = (new Date()).getTime() - uptime;
      if (diff < 0) {
        diff = 0;
      }
      var formatted = date.timingFormat(diff);
      return this.t('dashboard.services.uptime').format(formatted);
    }
    return this.t('services.service.summary.notRunning');
  }.property("service.resourceManagerStartTime"),

  nodeHeap: function () {
    var memUsed = this.get('service').get('jvmMemoryHeapUsed') * 1000000;
    var memCommitted = this.get('service').get('jvmMemoryHeapCommitted') * 1000000;
    var percent = memCommitted > 0 ? ((100 * memUsed) / memCommitted) : 0;
    return this.t('dashboard.services.hdfs.nodes.heapUsed').format(memUsed.bytesToSize(1, 'parseFloat'), memCommitted.bytesToSize(1, 'parseFloat'), percent.toFixed(1));
  }.property('service.jvmMemoryHeapUsed', 'service.jvmMemoryHeapCommitted'),

  nodeManagersLive: function () {
    var nodeManagers = this.get('service.nodeManagerNodes.length');
    var nodeManagersLive = this.get('service.nodeManagerLiveNodes.length');
    return this.t('dashboard.services.yarn.nodeManagers.live.msg').format(nodeManagersLive, nodeManagers);
  }.property('service.jvmMemoryHeapUsed', 'service.jvmMemoryHeapCommitted'),

  nodeManagersStatus: function () {
    var nmActive = this.get('service.nodeManagersCountActive');
    var nmLost = this.get('service.nodeManagersCountLost');
    var nmUnhealthy = this.get('service.nodeManagersCountUnhealthy');
    var nmRebooted = this.get('service.nodeManagersCountRebooted');
    var nmDecom = this.get('service.nodeManagersCountDecommissioned');
    return this.t('dashboard.services.yarn.nodeManagers.status.msg').format(nmActive, nmLost, nmUnhealthy, nmRebooted, nmDecom);
  }.property('service.nodeManagersCountActive', 'service.nodeManagersCountLost', 
      'service.nodeManagersCountUnhealthy', 'service.nodeManagersCountRebooted', 'service.nodeManagersCountDecommissioned'),

  containers: function () {
    var allocated = this.get('service.containersAllocated');
    var pending = this.get('service.containersPending');
    var reserved = this.get('service.containersReserved');
    return this.t('dashboard.services.yarn.containers.msg').format(allocated, pending, reserved);
  }.property('service.containersAllocated', 'service.containersPending', 'service.containersReserved'),

  apps: function () {
    var appsSubmitted = this.get('service.appsSubmitted');
    var appsRunning = this.get('service.appsRunning');
    var appsPending = this.get('service.appsPending');
    var appsCompleted = this.get('service.appsCompleted');
    var appsKilled = this.get('service.appsKilled');
    var appsFailed = this.get('service.appsFailed');
    return this.t('dashboard.services.yarn.apps.msg').format(appsSubmitted, appsRunning, appsPending, appsCompleted, appsKilled, appsFailed);
  }.property('service.appsSubmitted', 'service.appsRunning', 'service.appsPending', 'service.appsCompleted', 'service.appsKilled', 'service.appsFailed'),

});