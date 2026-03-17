/**
 * Interface for paginated results.
 */
interface QueryParameter {
  name: string;
  type: string;
  default?: string | boolean | number;
  description: string;
}

/**
 * Interface for the QueryParameters component props.
 */
interface QueryParameters {
  parameters: QueryParameter[];
}

/**
 * Component that displays the available query parameters for the API.
 * Shows a table of parameters with their descriptions, types, and examples.
 *
 * @param {Object} props - The component props
 * @param {Array<Object>} props.parameters - Array of parameter objects with details
 * @returns {React.JSX.Element} - The rendered query parameters documentation
 */
export default function QueryParameters({ parameters }: QueryParameters): React.JSX.Element {
  return (
    <section id="query-parameters">
      <h2>Query Parameters</h2>
      <p>The following parameters can be used to filter and paginate results:</p>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index}>
                <td>
                  <code>{param.name}</code>
                </td>
                <td>
                  <code>{param.type}</code>
                </td>
                <td>{param.default && <code>{param.default}</code>}</td>
                <td>{param.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
