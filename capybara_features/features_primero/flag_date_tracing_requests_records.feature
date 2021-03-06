# JIRA PRIMERO-490

@javascript @primero @search
Feature: Flag Date Tracing Requests Records
  As a Primero user, I want to be able to add a date to a flag so that I will know when I need to resolve the flag

  Background:
   Given I am logged in as an admin with username "primero_cp" and password "primero"
   And the following tracing request exist in the system:
     | unique_identifier                     | flag  | flag_message    | module_id        | created_by | owned_by   |
     | 21c4cba8-b410-4af6-b349-68c559af3aa9  | true  | Already Flagged | primeromodule-cp | primero_cp | primero_cp |
     | 21c4cba8-b410-4af6-b349-68c559bf3aa9  | false |                 | primeromodule-cp | primero_cp | primero_cp |
   When I access "tracing requests page"

  Scenario: As a logged in user and enter to view page, I want to flag and set date to the tracing request
   And I click the "9bf3aa9" link
   And I press the "Flags" button
   And I fill in "Flag Reason" with "Future Processing"
   And I fill in "tracing_request_flag_date" with "22-Jan-2014"
   And I press "Flag"
   And the tracing request record history should log "Flags changed by primero_cp"

  Scenario: As a logged in user and enter to edit page, I want to flag and set date to the tracing request
   And I click the "9bf3aa9" link
   And I press the "Edit" button
   And I press the "Flags" button
   And I fill in "Flag Reason" with "Future Processing"
   And I fill in "tracing_request_flag_date" with "21-Jan-2014"
   And I press "Flag"
   And the tracing request record history should log "Flags changed by primero_cp"

  #Remove flag in the GUI will be refactoring because it allow multiple flags now
  @wip
  Scenario: As a logged in user and enter to view page, I want to remove the flag from tracing request
   And I click the "9af3aa9" link
   And I press the "UnFlags" button
   And I fill in "Unflag Reason" with "No Processing"
   And I press "Unflag"
   And the tracing request record history should log "Flags changed by primero_cp"

  #Remove flag in the GUI will be refactoring because it allow multiple flags now
  @wip
  Scenario: As a logged in user and enter to edit page, I want to remove the flag from tracing request
   And I click the "9af3aa9" link
   And I press the "Edit" button
   And I press the "UnFlags" button
   And I fill in "Unflag Reason" with "No Processing"
   And I press "Unflag"
   And the tracing request record history should log "Flags changed by primero_cp"
   