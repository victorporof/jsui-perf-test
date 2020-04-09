import times from "lodash/times";
import React, { Component } from "react";

import ENV from "../../../../../js-repaint-perfs/ENV";

export class Query extends Component {
  render() {
    return (
      <div className={"td Query " + this.props.elapsedClassName}>
        {this.props.formatElapsed}
        <div className="popover left">
          <div className="popover-content">{this.props.query}</div>
          <div className="arrow" />
        </div>
      </div>
    );
  }
}

export class Database extends Component {
  render() {
    return (
      <div className="tr">
        <div className="td dbname">{this.props.dbname}</div>
        <div className="td query-count">
          <span className={this.props.lastSample.countClassName}>
            {this.props.lastSample.nbQueries}
          </span>
        </div>
        {this.props.lastSample.topFiveQueries.map((query, index) => {
          return (
            <Query
              key={index}
              query={query.query}
              elapsed={query.elapsed}
              formatElapsed={query.formatElapsed}
              elapsedClassName={query.elapsedClassName}
            />
          );
        })}
      </div>
    );
  }
}

export default class DBMon extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      databases: [],
    };
  }

  loadSamples() {
    this.setState({
      databases: ENV.generateData(true).toArray(),
    });
    requestAnimationFrame(() => this.loadSamples());
  }

  componentDidMount() {
    this.loadSamples();
  }

  render() {
    const databases = () =>
      this.state.databases.map((database) => (
        <Database
          key={database.dbname}
          lastMutationId={database.lastMutationId}
          dbname={database.dbname}
          samples={database.samples}
          lastSample={database.lastSample}
        />
      ));

    return (
      <div className="app">
        {this.props.children}
        {times(TABLE_COUNT).map((i) => (
          <div key={i} className="table table-striped latest-data">
            <div className="tbody">{databases()}</div>
          </div>
        ))}
      </div>
    );
  }
}
