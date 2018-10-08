import {GraphQLRequest} from 'apollo-link';

import Requests from '../Requests';

function pushRequests(requests: Requests, requestList: GraphQLRequest[]) {
  requestList.forEach(request => requests.push(request));
}

const mockRequests = [
  {query: 'q1', operationName: 'operation 1'},
  {query: 'q2', operationName: 'operation 2'},
  {query: 'q3', operationName: 'operation 2'},
];

const requests = new Requests();
pushRequests(requests, mockRequests);

describe('jest-mock-apollo Requests', () => {
  it('gets last operation', () => {
    expect(requests.last.query).toBe('q3');
  });

  it('gets nth operation', () => {
    expect(requests.nth(2).query).toBe('q3');
    expect(requests.nth(-1).query).toBe('q2');
  });

  it('gets all operations', () => {
    expect(requests.allOfOperation().length).toBe(3);
  });

  it('gets all operations with name', () => {
    expect(requests.allWithOperationName('operation 1').length).toBe(1);
    expect(requests.allWithOperationName('operation 2').length).toBe(2);
  });

  it('throws an error when last operation of type does not exist', () => {
    const requests = new Requests();

    expect(() => requests.lastOperation('LostPet')).toThrow(
      "no requests with operation 'LostPet' were found.",
    );
  });
});
