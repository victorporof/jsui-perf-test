import "../react-basic";
import { Database, Query } from "../react-basic/app";

Query.prototype.shouldComponentUpdate = function (nextProps) {
  if (nextProps.elapsedClassName !== this.props.elapsedClassName) return true;
  if (nextProps.formatElapsed !== this.props.formatElapsed) return true;
  if (nextProps.query !== this.props.query) return true;
  return false;
};

Database.prototype.shouldComponentUpdate = function (nextProps) {
  if (nextProps.lastMutationId === this.props.lastMutationId) return false;
  return true;
};
