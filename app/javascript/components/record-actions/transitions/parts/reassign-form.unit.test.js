import { expect } from "chai";
import { Button } from "@material-ui/core";
import { Formik, Field, Form } from "formik";
import { Map, List, fromJS } from "immutable";
import * as keydown from "keyevent";

import { SearchableSelect } from "../../../searchable-select";
import { setupMountedComponent } from "../../../../test";
import { getUsersByTransitionType } from "../selectors";

import ReassignForm from "./reassign-form";

describe("<ReassignForm />", () => {
  let component;
  const record = Map({ id: "123abc" });
  const initialState = Map({
    transitions: Map({
      reassign: Map({
        users: List([{ user_name: "primero" }])
      })
    })
  });
  const props = {
    recordType: "cases",
    record,
    handleClose: () => {}
  };
  beforeEach(() => {
    ({ component } = setupMountedComponent(ReassignForm, props, initialState));
  });

  it("renders Formik", () => {
    expect(component.find(Formik)).to.have.length(1);
  });

  it("renders Form", () => {
    expect(component.find(Form)).to.have.length(1);
  });

  it("renders SearchableSelect", () => {
    expect(component.find(SearchableSelect)).to.have.length(1);
  });

  it("renders Field", () => {
    expect(component.find(Field)).to.have.length(2);
  });

  it("renders Button", () => {
    expect(component.find(Button)).to.have.length(2);
  });

  describe("with getUsersByTransitionType", () => {
    describe("when mounting component", () => {
      const state = fromJS({
        records: {
          transitions: {
            reassign: {
              users: [{ user_name: "primero" }, { user_name: "primero_cp" }]
            }
          }
        }
      });
      const values = getUsersByTransitionType(state, "reassign");
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          ReassignForm,
          {
            record,
            handleClose: () => {},
            recordType: "cases"
          },
          state
        ));
      });
      it("should have same no. of users", () => {
        component.find(ReassignForm)
          .find("input")
          .first()
          .simulate("keyDown", {
            key: "ArrowDown",
            keyCode: keydown.DOM_VK_DOWN
          });
        expect(
          component.find("div.MuiButtonBase-root.MuiListItem-root")
        ).to.have.lengthOf(values.size);
      });
    });
  });

  it("renders SearchableSelect with valid props", () => {
    const reactSelectProps = { ...component.find(SearchableSelect).props() };

    [
      "onChange",
      "id",
      "name",
      "TextFieldProps",
      "excludeEmpty",
      "options",
      "onBlur"
    ].forEach(property => {
      expect(reactSelectProps).to.have.property(property);
      delete reactSelectProps[property];
    });
    expect(reactSelectProps).to.be.empty;
  });
});