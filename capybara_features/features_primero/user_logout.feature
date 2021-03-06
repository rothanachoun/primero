# JIRA PRIMERO-27
@javascript @primero
Feature:  Primero user logout
  As a logged in user, I want to log out from any page

  Scenario Outline: I am a logged in user and I want to log out
    Given an admin "primero" with a password "primero"
    When I log in as user "primero" using password "primero"
    When I access <page>
    Then I should see a "logout" button on the page
    Then I press the "Logout" button
    Then I am logged out and redirected to the log in page
    Examples:
      | page |
      | the home page|
      | system settings page |
      | create form page |
#      | new child page |

#Note: The new child page behaves differently: it has a popup dialog warning when navigating away. We shouldn't use it for this scenario.
