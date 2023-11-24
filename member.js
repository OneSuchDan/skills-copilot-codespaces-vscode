function skillsMember() {
  return {
    restrict: 'E',
    templateUrl: 'templates/skills-member.html',
    scope: {
      member: '=',
      skills: '=',
      edit: '&'
    },
    controller: function($scope) {
      $scope.editMember = function(member) {
        $scope.edit({member: member});
      };
    }
  };
}