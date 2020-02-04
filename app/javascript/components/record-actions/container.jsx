import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { RECORD_TYPES, RECORD_PATH } from "../../config";
import { useI18n } from "../i18n";
import { getPermissionsByRecord } from "../user/selectors";
import { getFiltersValuesByRecordType } from "../index-filters/selectors";
import {
  ACTIONS,
  EXPORT_CUSTOM,
  ENABLE_DISABLE_RECORD,
  ADD_NOTE,
  ADD_INCIDENT,
  ADD_SERVICE,
  REQUEST_APPROVAL,
  SHOW_EXPORTS,
  checkPermissions
} from "../../libs/permissions";
import Permission from "../application/permission";

import { NAME } from "./config";
import Notes from "./notes";
import { ToggleEnable } from "./toggle-enable";
import { ToggleOpen } from "./toggle-open";
import { Transitions } from "./transitions";
import AddIncident from "./add-incident";
import AddService from "./add-service";
import RequestApproval from "./request-approval";
import Exports from "./exports";

const Container = ({
  recordType,
  iconColor,
  record,
  mode,
  showListActions,
  selectedRecords
}) => {
  const i18n = useI18n();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReopenDialog, setOpenReopenDialog] = useState(false);
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [transitionType, setTransitionType] = useState("");
  const [openEnableDialog, setOpenEnableDialog] = useState(false);
  const [incidentDialog, setIncidentDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [openExportsDialog, setOpenExportsDialog] = useState(false);

  const enableState =
    record && record.get("record_state") ? "disable" : "enable";

  const openState =
    record && record.get("status") === "open" ? "close" : "reopen";

  const assignPermissions = [
    ACTIONS.MANAGE,
    ACTIONS.ASSIGN,
    ACTIONS.ASSIGN_WITHIN_USER_GROUP,
    ACTIONS.ASSIGN_WITHIN_AGENCY_PERMISSIONS
  ];

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const isSearchFromList = useSelector(state =>
    getFiltersValuesByRecordType(state, recordType).get("id_search")
  );

  const canAddNotes = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.ADD_NOTE
  ]);
  const canReopen = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REOPEN
  ]);

  const canRefer = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REFERRAL
  ]);

  const canClose = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.CLOSE
  ]);

  const canEnable = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.ENABLE_DISABLE_RECORD
  ]);

  const canAssign = checkPermissions(userPermissions, assignPermissions);

  const canTransfer = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.TRANSFER
  ]);

  const canRequest = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_BIA,
    ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
    ACTIONS.REQUEST_APPROVAL_CLOSURE
  ]);

  const canRequestBia = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_BIA
  ]);

  const canRequestCasePlan = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_CASE_PLAN
  ]);

  const canRequestClosure = checkPermissions(userPermissions, [
    ACTIONS.MANAGE,
    ACTIONS.REQUEST_APPROVAL_CLOSURE
  ]);

  const canAddIncident = checkPermissions(userPermissions, ADD_INCIDENT);

  const canAddService = checkPermissions(userPermissions, ADD_SERVICE);

  const canCustomExport = checkPermissions(userPermissions, EXPORT_CUSTOM);

  const canShowExports = checkPermissions(userPermissions, SHOW_EXPORTS);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemAction = itemAction => {
    handleClose();
    itemAction();
  };

  const handleReopenDialogOpen = () => {
    setOpenReopenDialog(true);
  };

  const handleReopenDialogClose = () => {
    setOpenReopenDialog(false);
  };

  const handleEnableDialogOpen = () => {
    setOpenEnableDialog(true);
  };

  const handleEnableDialogClose = () => {
    setOpenEnableDialog(false);
  };

  const transitionsProps = {
    record,
    transitionType,
    setTransitionType,
    recordType,
    userPermissions
  };

  const handleNotesClose = () => {
    setOpenNotesDialog(false);
  };

  const handleNotesOpen = () => {
    setOpenNotesDialog(true);
  };

  const handleRequestClose = () => {
    setRequestDialog(false);
  };

  const handleRequestOpen = () => {
    setRequestDialog(true);
  };

  const handleIncidentDialog = () => {
    setIncidentDialog(true);
  };

  const handleServiceDialog = () => {
    setServiceDialog(true);
  };

  const canOpenOrClose =
    (canReopen && openState === "reopen") ||
    (canClose && openState === "close");

  const handleExportsOpen = () => {
    setOpenExportsDialog(true);
  };

  const formRecordType = i18n.t(
    `forms.record_types.${RECORD_TYPES[recordType]}`
  );

  const actions = [
    {
      name: `${i18n.t("buttons.referral")} ${formRecordType}`,
      action: () => setTransitionType("referral"),
      recordType,
      condition: canRefer
    },
    {
      name: `${i18n.t("buttons.reassign")} ${formRecordType}`,
      action: () => setTransitionType("reassign"),
      recordType,
      condition: canAssign
    },
    {
      name: `${i18n.t("buttons.transfer")} ${formRecordType}`,
      action: () => setTransitionType("transfer"),
      recordType: ["cases", "incidents"],
      condition: canTransfer
    },
    {
      name: i18n.t("actions.incident_details_from_case"),
      action: handleIncidentDialog,
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      condition: showListActions
        ? canAddIncident
        : canAddIncident && Boolean(isSearchFromList)
    },
    {
      name: i18n.t("actions.services_section_from_case"),
      action: handleServiceDialog,
      recordType: RECORD_PATH.cases,
      recordListAction: true,
      condition: showListActions
        ? canAddService
        : canAddService && Boolean(isSearchFromList)
    },
    {
      name: i18n.t(`actions.${openState}`),
      action: handleReopenDialogOpen,
      recordType: RECORD_TYPES.all,
      condition: mode && mode.isShow && canOpenOrClose
    },
    {
      name: i18n.t(`actions.${enableState}`),
      action: handleEnableDialogOpen,
      recordType: RECORD_TYPES.all,
      condition: mode && mode.isShow && canEnable
    },
    {
      name: i18n.t("actions.notes"),
      action: handleNotesOpen,
      recordType: RECORD_TYPES.all,
      condition: canAddNotes
    },
    {
      name: i18n.t("actions.request_approval"),
      action: handleRequestOpen,
      recordType: "all",
      condition: canRequest
    },
    {
      name: i18n.t("cases.export"),
      action: handleExportsOpen,
      recordType: RECORD_TYPES.all,
      condition: canShowExports
    }
  ];

  const toggleEnableDialog = (
    <ToggleEnable
      close={handleEnableDialogClose}
      openEnableDialog={openEnableDialog}
      record={record}
      recordType={recordType}
    />
  );

  const toggleOpenDialog = (
    <ToggleOpen
      close={handleReopenDialogClose}
      openReopenDialog={openReopenDialog}
      record={record}
      recordType={recordType}
    />
  );

  const filterItems = items => items.filter(a => {
    const actionCondition = typeof a.condition === "undefined" || a.condition;

    if (showListActions) {
      return a.recordListAction && actionCondition;
    }

    return (
      (a.recordType === RECORD_TYPES.all ||
        a.recordType === recordType ||
        (Array.isArray(a.recordType) && a.recordType.includes(recordType))) &&
      actionCondition
    );
  });

  const filteredActions = filterItems(actions);
  const actionItems = filteredActions?.map(action => {
    const disabled = showListActions && !selectedRecords.length;

    return (
      <MenuItem
        key={action.name}
        selected={action.name === "Pyxis"}
        onClick={() => handleItemAction(action.action)}
        disabled={disabled}
      >
        {action.name}
      </MenuItem>
    );
  });

  const requestsApproval = [
    {
      name: "Assessment",
      condition: canRequestBia,
      recordType: RECORD_TYPES.all,
      value: "bia"
    },
    {
      name: "Case Plan",
      condition: canRequestCasePlan,
      recordType: RECORD_TYPES.all,
      value: "case_plan"
    },
    {
      name: "Closure",
      condition: canRequestClosure,
      recordType: RECORD_TYPES.all,
      value: "closure"
    }
  ];

  const allowedRequestsApproval = filterItems(requestsApproval);

  return (
    <>
      {mode && mode.isShow ? (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon color={iconColor} />
        </IconButton>
      ) : null}

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actionItems}
      </Menu>

      {canOpenOrClose ? toggleOpenDialog : null}

      <Permission resources={recordType} actions={ENABLE_DISABLE_RECORD}>
        {toggleEnableDialog}
      </Permission>

      <Transitions {...transitionsProps} />

      <Permission resources={recordType} actions={ADD_INCIDENT}>
        <AddIncident
          openIncidentDialog={incidentDialog}
          close={() => setIncidentDialog(false)}
          recordType={recordType}
          records={[]}
          selectedRowsIndex={selectedRecords}
        />
      </Permission>

      <Permission resources={recordType} actions={ADD_SERVICE}>
        <AddService
          openServiceDialog={serviceDialog}
          close={() => setServiceDialog(false)}
          recordType={recordType}
          selectedRowsIndex={selectedRecords}
        />
      </Permission>

      <Permission resources={recordType} actions={ADD_NOTE}>
        <Notes
          close={handleNotesClose}
          openNotesDialog={openNotesDialog}
          record={record}
          recordType={recordType}
        />
      </Permission>

      <Permission resources={recordType} actions={REQUEST_APPROVAL}>
        <RequestApproval
          openRequestDialog={requestDialog}
          close={() => handleRequestClose()}
          subMenuItems={allowedRequestsApproval}
          record={record}
          recordType={recordType}
        />
      </Permission>

      <Permission resources={recordType} actions={SHOW_EXPORTS}>
        <Exports
          openExportsDialog={openExportsDialog}
          close={setOpenExportsDialog}
          recordType={recordType}
          userPermissions={userPermissions}
        />
      </Permission>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  iconColor: PropTypes.string,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.array,
  showListActions: PropTypes.bool
};

export default Container;