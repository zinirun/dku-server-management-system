import gql from 'graphql-tag';

export const GET_USER_INFO = gql`
    query getUserInfo {
        getUserInfo {
            id
            userId
            type
            name
            department
            tel
            penalty
        }
    }
`;

export const GET_SERVERS_FROM_CLIENT = gql`
    query getServersFromClient {
        getServersFromClient {
            id
            __typename @skip(if: true)
            name
            os
            cpu
            ram
        }
    }
`;

export const GET_SERVERS_FROM_ADMIN = gql`
    query getServersFromAdmin {
        getServersFromAdmin {
            id
            __typename @skip(if: true)
            name
            os
            cpu
            ram
            location
        }
    }
`;

export const GET_RESERVATIONS = gql`
    query getReservations {
        getReservations {
            id
            __typename @skip(if: true)
            serverId
            start
            end
            serverOS
            serverName
        }
    }
`;

export const GET_RESERVABLE_SERVERS = gql`
    query getReservableServers($start: Date!, $end: Date!) {
        getReservableServers(start: $start, end: $end) {
            id
            __typename @skip(if: true)
            name
            os
            cpu
            ram
        }
    }
`;

export const GET_CONFIRM_RESERVATION_FROM_CLIENT = gql`
    query getConfirmReservationFromClient {
        getConfirmReservationFromClient {
            createdAt
            start
            end
            os
            applyOk
        }
    }
`;

export const GET_MONTHLY_RESERVATION = gql`
    query getMonthlyReservation($serverId: ID!) {
        getMonthlyReservation(serverId: $serverId) {
            serverId
            start
            end
        }
    }
`;

export const GET_CONFIRMS = gql`
    query getConfirms {
        getConfirms {
            id
            __typename @skip(if: true)
            serverId
            start
            end
            applyOk
            createdAt
            userName
            userDepartment
        }
    }
`;

export const GET_MEMBERS = gql`
    query getMembers {
        getMembers {
            id
            __typename @skip(if: true)
            userId
            type
            name
            department
            tel
            penalty
        }
    }
`;

export const GET_CALENDAR_RESERVATIONS = gql`
    query getCalendarReservations {
        getCalendarReservations {
            id
            __typename @skip(if: true)
            start
            end
            serverId
            name
            department
        }
    }
`;

export const POST_RESERVATION = gql`
    mutation postReservation($reservation: ReservationInput!) {
        postReservation(reservation: $reservation) {
            id
            serverId
            start
            end
            purpose
            applyOk
            createdAt
        }
    }
`;

export const POST_RETURN = gql`
    mutation postReturn($myReturn: ReturnInput!) {
        postReturn(myReturn: $myReturn)
    }
`;

export const UPDATE_RESERVATION_APPLY = gql`
    mutation updateReservationApply($id: ID!, $applyOk: Int!) {
        updateReservationApply(id: $id, applyOk: $applyOk)
    }
`;
