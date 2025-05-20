/**
 * Interface for paginated results.
 */
interface IQueryParameter {
  name: string;
  type: string;
  description: string;
  defaultValue?: string | boolean | number;
  possibleValues: string;
}

/**
 * Interface for the QueryParameters component props.
 */
interface IQueryParametersProps {
  parameters: IQueryParameter[];
}

/**
 * Component that displays the available query parameters for the API.
 * Shows a table of parameters with their descriptions, types, and examples.
 *
 * @param {Object} props - The component props
 * @param {Array<Object>} props.parameters - Array of parameter objects with details
 * @returns {React.JSX.Element} - The rendered query parameters documentation
 */
export function QueryParameters({ parameters }: IQueryParametersProps): React.JSX.Element {
  const isLastItem = (index: number) => index === parameters.length - 1;

  return (
    <div className="mb-8">
      <h3 className="mb-4">Query Parameters</h3>
      <p className="mb-4">The following parameters can be used to filter and paginate results:</p>

      <div className="overflow-scroll rounded-lg border border-slate-200">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th className="table-th">Parameter</th>
              <th className="table-th">Type</th>
              <th className="table-th">Description</th>
              <th className="table-th">Default Value</th>
              <th className="table-th">Possible Values</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index} className="table-row-hover">
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.name}</td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.type}</td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.description}</td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>
                  {param.defaultValue && <code>{param.defaultValue}</code>}
                </td>
                <td className={`table-td ${!isLastItem(index) ? "" : "border-b-0"}`}>{param.possibleValues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
