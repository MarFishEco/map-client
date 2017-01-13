import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { FLAG_FILTERS_LIMIT, FLAGS } from 'constants';
import iso3311a2 from 'iso-3166-1-alpha-2';

import flagFilterStyles from 'styles/components/map/c-flag-filters.scss';
import selectorStyles from 'styles/components/shared/c-selector.scss';

import BlendingIcon from 'babel!svg-react!assets/icons/blending-icon.svg?name=BlendingIcon';
import RemoveFilterIcon from 'babel!svg-react!assets/icons/delete-cross-icon.svg?name=RemoveFilterIcon';

class FilterPanel extends Component {

  componentWillMount() {
    this.countryOptions = this.getCountryOptions();
  }

  getCountryOptions() {
    const countryNames = [];
    const countryOptions = [];

    Object.keys(FLAGS).forEach((index) => {
      if (iso3311a2.getCountry(FLAGS[index])) {
        countryNames.push({
          name: iso3311a2.getCountry(FLAGS[index]),
          id: index
        });
      }
    });

    countryNames.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }

      if (b.name > a.name) {
        return -1;
      }

      return 0;
    });

    countryOptions.push(<option key="" value="">All</option>);

    countryNames.forEach((country) => {
      countryOptions.push(<option key={country.id} value={country.id}>{country.name}</option>);
    });

    return countryOptions;
  }

  addFilter() {
    const currentFilters = this.props.flags;
    currentFilters.push({
      flag: 'ALL'
    });

    this.props.setFlagFilters(currentFilters);
  }

  removeFilter(index) {
    const filters = _.cloneDeep(this.props.flags);
    filters.splice(index, 1);

    this.props.setFlagFilters(filters);
  }

  toggleBlending() {
    console.warn('toggleBlending (WIP)');
  }

  onChange(country, index) {
    const filters = _.cloneDeep(this.props.flags);
    if (filters[index] === undefined) return;

    filters[index].flag = country;

    this.props.setFlagFilters(filters);
  }

  render() {
    const filterSelectors = [];
    this.props.flags.forEach((flagFilter, i) => {
      filterSelectors.push(
        <li
          className={flagFilterStyles['filter-item']}
          key={i}
        >
          <div className={classnames(selectorStyles['c-selector'], selectorStyles['-flag-filter'])}>
            <select
              name="country"
              onChange={(e) => this.onChange(e.target.value, i)}
              value={flagFilter.flag}
            >
              {this.countryOptions}
            </select>
          </div>
          <div className={flagFilterStyles['filter-option']}>
            <ul className={flagFilterStyles['filter-option-list']}>
              <li className={flagFilterStyles['filter-option-item']}>
                <BlendingIcon
                  className={flagFilterStyles['icon-blending']}
                  onClick={() => this.toggleBlending()}
                />
              </li>
              <li className={flagFilterStyles['filter-option-item']}>
                <RemoveFilterIcon
                  className={flagFilterStyles['icon-delete-cross']}
                  onClick={() => this.removeFilter(i)}
                />
              </li>
            </ul>
          </div>
        </li>
      );
    });

    return (
      <div className={flagFilterStyles['c-flag-filters']}>
        {filterSelectors &&
          <ul className={flagFilterStyles['filter-list']}>
            {filterSelectors}
          </ul>}
        {this.props.flags.length < FLAG_FILTERS_LIMIT &&
          <button
            className={flagFilterStyles['filter-button']}
            onClick={() => this.addFilter()}
          >
            add filter
          </button>}
      </div>
    );
  }
}

FilterPanel.propTypes = {
  flags: React.PropTypes.array,
  setFlagFilters: React.PropTypes.func
};

export default FilterPanel;
