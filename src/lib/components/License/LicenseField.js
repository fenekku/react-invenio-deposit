// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';

import { Button, Form, Dropdown, List } from 'semantic-ui-react';

import { FieldLabel } from 'react-invenio-forms';
import { LicenseModal } from './LicenseModal';

export class LicenseField extends Component {
  state = {
    editModalOpen: false,
    standardModalOpen: false,
    customModalOpen: false,
  };

  openModal = (modalId) => {
    this.setState({ [modalId]: true });
  };

  closeModal = (modalId) => {
    this.setState({ [modalId]: false });
  };

  renderFormField = (props) => {
    const {
      form: { values, errors },
      ...arrayHelpers
    } = props;
    const { fieldPath, label, labelIcon, required } = this.props;
    return (
      <Form.Field required={required}>
        <FieldLabel
          htmlFor={fieldPath}
          icon={labelIcon}
          label={label}
        ></FieldLabel>
        <List>
          {getIn(values, fieldPath, []).map((value, index, array) => {
            const arrayPath = fieldPath;
            const indexPath = index;
            const key = `${arrayPath}.${indexPath}`;
            const licenseType = value.id ? 'standard' : 'custom';
            return (
              <List.Item key={key} className="license-listitem">
                <List.Content floated="right">
                  <Button
                    size="mini"
                    positive
                    type="button"
                    onClick={() => this.openModal('editModalOpen')}
                  >
                    Change
                  </Button>
                  <LicenseModal
                    searchConfig={this.props.searchConfig}
                    onClose={() => this.closeModal('editModalOpen')}
                    modalOpen={this.state.editModalOpen}
                    onLicenseChange={(selectedLicense) => {
                      arrayHelpers.replace(indexPath, selectedLicense);
                    }}
                    mode={licenseType}
                    initialLicense={licenseType === 'custom' ? value : null}
                    action="edit"
                  />
                  <Button
                    size="mini"
                    negative
                    type="button"
                    onClick={() => arrayHelpers.remove(indexPath)}
                  >
                    Remove
                  </Button>
                </List.Content>
                <List.Content>
                  <List.Header>{getIn(values, `${key}.title`, '')}</List.Header>
                  <List.Description>
                    {
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getIn(values, `${key}.description`, ''),
                        }}
                      ></div>
                    }
                  </List.Description>
                </List.Content>
              </List.Item>
            );
          })}
          <Dropdown
            floating
            text="Add a license"
            icon="plus"
            labeled
            button
            className="small blue icon add-licenses"
          >
            <Dropdown.Menu>
              <Dropdown.Item
                key="standard"
                onClick={() => this.openModal('standardModalOpen')}
              >
                Add standard
              </Dropdown.Item>
              <Dropdown.Item
                key="custom"
                onClick={() => this.openModal('customModalOpen')}
              >
                Create custom
              </Dropdown.Item>
              <LicenseModal
                searchConfig={this.props.searchConfig}
                onClose={() => this.closeModal('standardModalOpen')}
                modalOpen={this.state.standardModalOpen}
                onLicenseChange={(selectedLicense) => {
                  arrayHelpers.push(selectedLicense);
                }}
                mode="standard"
                action="add"
              />
              <LicenseModal
                searchConfig={this.props.searchConfig}
                onClose={() => this.closeModal('customModalOpen')}
                modalOpen={this.state.customModalOpen}
                onLicenseChange={(selectedLicense) => {
                  arrayHelpers.push(selectedLicense);
                }}
                action="add"
                mode="custom"
              />
            </Dropdown.Menu>
          </Dropdown>
        </List>
      </Form.Field>
    );
  };
  setOpen = (open) => this.setState({ open });

  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}
LicenseField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  searchConfig: PropTypes.object.isRequired,
  required: PropTypes.bool,
};

LicenseField.defaultProps = {
  fieldPath: 'metadata.licenses',
  label: 'Licenses',
  labelIcon: 'drivers license',
  required: false,
};