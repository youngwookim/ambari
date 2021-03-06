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
'use strict';

angular.module('ambariAdminConsole')
.controller('CreateViewInstanceCtrl',['$scope', 'View', 'Alert', '$routeParams', '$location', 'UnsavedDialog', function($scope, View, Alert, $routeParams, $location, UnsavedDialog) {
  $scope.form = {};
  var targetUrl = '';

  function loadMeta(){
    View.getMeta($routeParams.viewId, $scope.version).then(function(data) {
      var viewVersion = data.data;
      $scope.view = viewVersion;

      var parameters = viewVersion.ViewVersionInfo.parameters;

      angular.forEach(parameters, function (item) {
        item.value = item['defaultValue'];
        item.displayName = item.name.replace(/\./g, '\.\u200B');
      });

      $scope.instance = {
        view_name: viewVersion.ViewVersionInfo.view_name,
        version: viewVersion.ViewVersionInfo.version,
        instance_name: '',
        label: '',
        visible: true,
        icon_path: '',
        icon64_path: '',
        properties: parameters,
        description: ''
      };
    });
  }


  $scope.$watch(function(scope) {
    return scope.version;
  }, function(version) {
    if( version ){
      loadMeta();
    }
  });

  // $scope.view = viewVersion;
  $scope.isAdvancedClosed = true;
  $scope.instanceExists = false;

  $scope.versions = [];
  $scope.version = null;

  View.getVersions($routeParams.viewId).then(function(versions) {
    $scope.versions = versions;
    $scope.version = $scope.versions[$scope.versions.length-1];
  });


  $scope.nameValidationPattern = /^\s*\w*\s*$/;

  $scope.save = function() {
  if (!$scope.form.instanceCreateForm.isSaving) {
    $scope.form.instanceCreateForm.submitted = true;
    if($scope.form.instanceCreateForm.$valid){
      $scope.form.instanceCreateForm.isSaving = true;
      View.createInstance($scope.instance)
        .then(function(data) {
          Alert.success('Created View Instance ' + $scope.instance.instance_name);
          $scope.form.instanceCreateForm.$setPristine();
          if( targetUrl ){
            $location.path(targetUrl);
          } else {
            $location.path('/views/' + $scope.instance.view_name + '/versions/' + $scope.instance.version + '/instances/' + $scope.instance.instance_name + '/edit');
          }
            $scope.form.instanceCreateForm.isSaving = false;
        })
        .catch(function (data) {
          var errorMessage = data.message;
          var showGeneralError = true;

          if (data.status >= 400) {
            try {
              var errorObject = JSON.parse(errorMessage);
              errorMessage = errorObject.detail;
              angular.forEach(errorObject.propertyResults, function (item, key) {
                $scope.form.instanceCreateForm[key].validationError = !item.valid;
                if (!item.valid) {
                  showGeneralError = false;
                  $scope.form.instanceCreateForm[key].validationMessage = item.detail;
                }
              });

              if (showGeneralError) {
                $scope.form.instanceCreateForm.generalValidationError = errorMessage;  
              }
            } catch (e) {
              console.error('Unable to parse error message:', data.message);
            }
          }
          Alert.error('Cannot create instance', errorMessage);
          $scope.form.instanceCreateForm.isSaving = false;
        });
      }
    }
  };

  $scope.cancel = function() {
    $scope.form.instanceCreateForm.$setPristine();
    $location.path('/views');
  };

  $scope.$on('$locationChangeStart', function(event, __targetUrl) {
    if( $scope.form.instanceCreateForm.$dirty ){
      UnsavedDialog().then(function(action) {
        targetUrl = __targetUrl.split('#').pop();
        switch(action){
          case 'save':
            $scope.save();
            break;
          case 'discard':
            $scope.form.instanceCreateForm.$setPristine();
            $location.path(targetUrl);
            break;
          case 'cancel':
            targetUrl = '';
            break;
        }
      });
      event.preventDefault();
    }
  });

}]);
