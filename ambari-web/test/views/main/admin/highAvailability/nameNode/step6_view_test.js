/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var App = require('app');
require('views/main/admin/highAvailability/nameNode/step6_view');

describe('App.HighAvailabilityWizardStep6View', function () {
  var view = App.HighAvailabilityWizardStep6View.create({
    controller: Em.Object.create({
      content: {},
      pullCheckPointStatus: Em.K
    })
  });

  describe("#didInsertElement()", function () {
    before(function () {
      sinon.spy(view.get('controller'), 'pullCheckPointStatus');
    });
    after(function () {
      view.get('controller').pullCheckPointStatus.restore();
    });
    it("call pullCheckPointStatus", function () {
      view.didInsertElement();
      expect(view.get('controller').pullCheckPointStatus.calledOnce).to.be.true;
    });
  });

  describe("#step6BodyText", function() {
    it("", function() {
      view.set('controller.content.masterComponentHosts', [{
        isCurNameNode: true,
        hostName: 'host1'
      }]);
      view.set('controller.content.hdfsUser', 'user');
      view.propertyDidChange('step6BodyText');
      expect(view.get('step6BodyText')).to.equal(Em.I18n.t('admin.highAvailability.wizard.step6.body').format('user', 'host1'));
    });
  });

  describe("#jnCheckPointText", function() {
    it("isNextEnabled true", function() {
      view.set('controller.isNextEnabled', true);
      view.propertyDidChange('jnCheckPointText');
      expect(view.get('jnCheckPointText')).to.equal(Em.I18n.t('admin.highAvailability.wizard.step6.jsInit'));
    });
    it("isNextEnabled false", function() {
      view.set('controller.isNextEnabled', false);
      view.propertyDidChange('jnCheckPointText');
      expect(view.get('jnCheckPointText')).to.equal(Em.I18n.t('admin.highAvailability.wizard.step6.jsNoInit'));
    });
  });
});