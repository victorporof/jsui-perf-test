import times from "lodash/times";
import React, { Component } from "react";

import ENV from "../../../js-repaint-perfs/ENV";

class Query extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.elapsedClassName !== this.props.elapsedClassName) return true;
    if (nextProps.formatElapsed !== this.props.formatElapsed) return true;
    if (nextProps.query !== this.props.query) return true;
    return false;
  }

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

class Database extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.lastMutationId === this.props.lastMutationId) return false;
    return true;
  }

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
  constructor(props) {
    super(props);

    this.state = {
      databases: []
    };
  }

  loadSamples() {
    this.setState({
      databases: ENV.generateData(true).toArray()
    });
    requestAnimationFrame(() => this.loadSamples());
  }

  componentDidMount() {
    this.loadSamples();
  }

  render() {
    const databases = () =>
      this.state.databases.map(database => (
        <Database
          key={database.dbname}
          lastMutationId={database.lastMutationId}
          dbname={database.dbname}
          samples={database.samples}
          lastSample={database.lastSample}
        />
      ));

    return (
      <div className="dbmon">
        {times(2).map(i => (
          <div key={i} className="table table-striped latest-data">
            <div className="tbody">{databases()}</div>
          </div>
        ))}
      </div>
    );
  }
}
