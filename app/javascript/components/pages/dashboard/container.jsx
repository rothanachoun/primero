import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, batch, useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import makeStyles from "@material-ui/styles/makeStyles";
import { fromJS } from "immutable";

import {
  OptionsBox,
  DashboardTable,
  LineChart,
  OverviewBox,
  BadgedIndicator,
  PieChart
} from "../../dashboard";
import { FlagList } from "../../dashboard/flag-list";
import { Services } from "../../dashboard/services";
import { useI18n } from "../../i18n";
import { PageContainer, PageHeading, PageContent } from "../../page";
import { RESOURCES, ACTIONS } from "../../../libs/permissions";
import Permission from "../../application/permission";
import { LOOKUPS, MODULES, RECORD_TYPES } from "../../../config";
import { selectModule } from "../../application";
import { getOption } from "../../record-form";

import * as actions from "./action-creators";
import {
  getCasesByAssessmentLevel,
  selectFlags,
  selectCasesByStatus,
  selectCasesByCaseWorker,
  selectCasesRegistration,
  selectCasesOverview,
  selectServicesStatus,
  getWorkflowIndividualCases,
  getWorkflowTeamCases,
  getApprovalsAssessment,
  getApprovalsCasePlan,
  getApprovalsClosure
} from "./selectors";
import styles from "./styles.css";
import { toData1D, toListTable } from "./helpers";

const Dashboard = ({
  fetchFlags,
  fetchCasesByStatus,
  fetchCasesByCaseWorker,
  fetchCasesRegistration,
  fetchCasesOverview,
  fetchServicesStatus,
  getDashboardsData,
  flags,
  casesByAssessmentLevel,
  casesByStatus,
  casesByCaseWorker,
  casesRegistration,
  casesOverview,
  casesWorkflow,
  casesWorkflowTeam,
  servicesStatus,
  approvalsAssessment,
  approvalsCasePlan,
  approvalsClosure
}) => {
  useEffect(() => {
    batch(() => {
      fetchFlags();
      fetchCasesByStatus();
      fetchCasesByCaseWorker();
      fetchCasesRegistration();
      fetchCasesOverview();
      fetchServicesStatus();
      getDashboardsData();
    });
  }, [
    fetchCasesByCaseWorker,
    fetchCasesByStatus,
    fetchCasesOverview,
    fetchCasesRegistration,
    fetchFlags,
    fetchServicesStatus,
    getDashboardsData
  ]);

  const css = makeStyles(styles)();

  const theme = useTheme();

  const i18n = useI18n();

  const labelsRiskLevel = useSelector(state =>
    getOption(state, LOOKUPS.risk_level, i18n)
  );

  const getDoughnutInnerText = () => {
    const text = [];
    const openCases = casesByStatus.get("open");
    const closedCases = casesByStatus.get("closed");
    const baseFontStyle = theme.typography.fontFamily.replace(/"/g, "");

    if (openCases) {
      text.push({
        text: `${openCases} ${i18n.t("dashboard.open")}`,
        fontStyle: `bold ${baseFontStyle}`
      });
    }
    if (closedCases) {
      text.push({
        text: `${closedCases} ${i18n.t("dashboard.closed")}`,
        fontStyle: baseFontStyle
      });
    }

    return text;
  };

  const columns = [
    { label: i18n.t("dashboard.case_worker"), name: "case_worker", id: true },
    { label: i18n.t("dashboard.assessment"), name: "assessment" },
    { label: i18n.t("dashboard.case_plan"), name: "case_plan" },
    { label: i18n.t("dashboard.follow_up"), name: "follow_up" },
    { label: i18n.t("dashboard.services"), name: "services" }
  ];

  const casesChartData = {
    innerTextConfig: getDoughnutInnerText(),
    labels: [i18n.t("dashboard.open"), i18n.t("dashboard.closed")],
    datasets: [
      {
        data: [casesByStatus.get("open"), casesByStatus.get("closed")],
        backgroundColor: ["#0094BE", "#E0DFD6"]
      }
    ]
  };

  const registrationChartData = {
    labels: casesRegistration.keySeq().toJS(),
    datasets: [
      {
        data: casesRegistration.valueSeq().toJS(),
        lineTension: 0.1,
        steppedLine: false
      }
    ]
  };

  const workflowLabels = useSelector(
    state =>
      selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]?.[
        i18n.locale
      ]
  );

  const casesWorkflowProps = {
    ...toData1D(casesWorkflow, workflowLabels)
  };

  const casesWorkflowTeamProps = {
    ...toListTable(casesWorkflowTeam, workflowLabels)
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.home")} />
      <PageContent>
        <Grid container spacing={3} classes={{ root: css.container }}>
          <Permission
            resources={RESOURCES.dashboards}
            actions={[
              ACTIONS.DASH_APPROVALS_ASSESSMENT,
              ACTIONS.DASH_APPROVALS_CASE_PLAN,
              ACTIONS.DASH_APPROVALS_CLOSURE
            ]}
          >
            <Grid item md={12}>
              <OptionsBox title={i18n.t("dashboard.approvals")}>
                <Grid container>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_APPROVALS_ASSESSMENT}
                    >
                      <OptionsBox flat>
                        <OverviewBox
                          items={approvalsAssessment}
                          sumTitle={i18n.t(approvalsAssessment.get("name"))}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_APPROVALS_CASE_PLAN}
                    >
                      <OptionsBox flat>
                        <OverviewBox
                          items={approvalsCasePlan}
                          sumTitle={i18n.t(approvalsCasePlan.get("name"))}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                  <Grid item xs>
                    <Permission
                      resources={RESOURCES.dashboards}
                      actions={ACTIONS.DASH_APPROVALS_CLOSURE}
                    >
                      <OptionsBox flat>
                        <OverviewBox
                          items={approvalsClosure}
                          sumTitle={i18n.t(approvalsClosure.get("name"))}
                        />
                      </OptionsBox>
                    </Permission>
                  </Grid>
                </Grid>
              </OptionsBox>
            </Grid>
          </Permission>
          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_CASE_RISK}
          >
            <Grid item md={6}>
              <OptionsBox title={i18n.t("dashboard.overview")}>
                <OptionsBox flat>
                  <BadgedIndicator
                    data={casesByAssessmentLevel}
                    sectionTitle={i18n.t(casesByAssessmentLevel.get("name"))}
                    lookup={labelsRiskLevel}
                  />
                </OptionsBox>
              </OptionsBox>
            </Grid>
          </Permission>
          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_WORKFLOW}
          >
            <Grid item md={6}>
              <OptionsBox title={i18n.t(casesWorkflow.get("name"))}>
                <PieChart {...casesWorkflowProps} />
              </OptionsBox>
            </Grid>
          </Permission>

          <Permission
            resources={RESOURCES.dashboards}
            actions={ACTIONS.DASH_WORKFLOW_TEAM}
          >
            <Grid item md={12} hidden={!casesWorkflowTeam?.size}>
              <OptionsBox title={i18n.t(casesWorkflowTeam.get("name"))}>
                <DashboardTable {...casesWorkflowTeamProps} />
              </OptionsBox>
            </Grid>
          </Permission>
          {/* <Grid item md={12} hidden>
            <OptionsBox title="CASE OVERVIEW">
              <DashboardTable columns={columns} data={casesByCaseWorker} />
            </OptionsBox>
          </Grid>
          <Grid item md={8} xs={12} hidden>
            <OptionsBox title="CASE OVERVIEW">
              <OverviewBox items={casesOverview} chartData={casesChartData} />
            </OptionsBox>
            <OptionsBox title={i18n.t("dashboard.cases_by_task_overdue")}>
              <DashboardTable columns={columns} data={casesByCaseWorker} />
            </OptionsBox>
            <OptionsBox title={i18n.t("dashboard.registration")}>
              <LineChart
                chartData={registrationChartData}
                title="Total case registrations over time"
              />
            </OptionsBox>
            <Services servicesList={servicesStatus} />
          </Grid>
          <Grid item md={4} xs={12} hidden>
            <OptionsBox title={i18n.t("dashboard.flagged")}>
              <FlagList flags={flags} i18n={i18n} />
            </OptionsBox>
          </Grid> */}
        </Grid>
      </PageContent>
    </PageContainer>
  );
};

Dashboard.displayName = "Dashboard";

Dashboard.propTypes = {
  approvalsAssessment: PropTypes.object.isRequired,
  approvalsCasePlan: PropTypes.object.isRequired,
  approvalsClosure: PropTypes.object.isRequired,
  casesByAssessmentLevel: PropTypes.object.isRequired,
  casesByCaseWorker: PropTypes.object.isRequired,
  casesByStatus: PropTypes.object.isRequired,
  casesOverview: PropTypes.object.isRequired,
  casesRegistration: PropTypes.object.isRequired,
  casesWorkflow: PropTypes.object.isRequired,
  casesWorkflowTeam: PropTypes.object.isRequired,
  fetchCasesByCaseWorker: PropTypes.func.isRequired,
  fetchCasesByStatus: PropTypes.func.isRequired,
  fetchCasesOverview: PropTypes.func.isRequired,
  fetchCasesRegistration: PropTypes.func.isRequired,
  fetchFlags: PropTypes.func.isRequired,
  fetchServicesStatus: PropTypes.func.isRequired,
  flags: PropTypes.object.isRequired,
  getDashboardsData: PropTypes.func.isRequired,
  openPageActions: PropTypes.func.isRequired,
  servicesStatus: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    flags: selectFlags(state),
    casesByAssessmentLevel: getCasesByAssessmentLevel(state),
    casesWorkflow: getWorkflowIndividualCases(state),
    casesWorkflowTeam: getWorkflowTeamCases(state),
    approvalsAssessment: getApprovalsAssessment(state),
    approvalsClosure: getApprovalsClosure(state),
    approvalsCasePlan: getApprovalsCasePlan(state),
    casesByStatus: selectCasesByStatus(state),
    casesByCaseWorker: selectCasesByCaseWorker(state),
    casesRegistration: selectCasesRegistration(state),
    casesOverview: selectCasesOverview(state),
    servicesStatus: selectServicesStatus(state)
  };
};

const mapDispatchToProps = {
  fetchFlags: actions.fetchFlags,
  fetchCasesByStatus: actions.fetchCasesByStatus,
  fetchCasesByCaseWorker: actions.fetchCasesByCaseWorker,
  fetchCasesRegistration: actions.fetchCasesRegistration,
  fetchCasesOverview: actions.fetchCasesOverview,
  fetchServicesStatus: actions.fetchServicesStatus,
  getDashboardsData: actions.fetchDashboards,
  openPageActions: actions.openPageActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);