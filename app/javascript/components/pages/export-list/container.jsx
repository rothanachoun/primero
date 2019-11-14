import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles/";
import DownloadIcon from "@material-ui/icons/GetApp";
import { fromJS } from "immutable";

import { PageContainer, PageHeading, PageContent } from "../../page";
import IndexTable from "../../index-table";
import { useI18n } from "../../i18n";

import { fetchExports } from "./action-creators";
import styles from "./styles.css";
import { selectListHeaders } from "./selectors";

const ExportList = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordType = "bulk_exports";

  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );

  const columns = listHeaders.map(c => {
    const options = {
      ...{
        ...(c.name === "file_name"
          ? {
              id: true,
              customBodyRender: value => {
                return (
                  <div className={css.link}>
                    <DownloadIcon />
                    {value}
                  </div>
                );
              }
            }
          : {})
      }
    };

    return {
      name: c.field_name,
      label: c.name,
      options
    };
  });

  const options = {
    selectableRows: "none"
  };

  const tableOptions = {
    recordType,
    columns,
    options,
    defaultFilters: fromJS({
      per: 20,
      page: 1
    }),
    onTableChange: fetchExports
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.bulk_exports")} />
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </PageContainer>
  );
};

ExportList.displayName = "ExportList";

export default ExportList;