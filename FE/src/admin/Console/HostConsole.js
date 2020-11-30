import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Box,
} from '@material-ui/core';
import StatusCircle from './StatusCircle';
import { useQuery, useMutation } from 'react-apollo';
import { GET_HOST_STATUS, POST_CMD_TO_HOST } from '../../queries';
import SnackMessage from '../../client/components/SnackMessage';
import RefreshIcon from '@material-ui/icons/Refresh';
import CmdAskDialog from './CmdAskDialog';

export default function HostConsole({ hosts, classes, handleOpenContainerConsole }) {
    const [hostStatus, setHostStatus] = useState([]);
    const { loading, error, data, refetch: refetchStatus } = useQuery(GET_HOST_STATUS);
    const [hostId, setHostId] = useState(null);
    const [message, setMessage] = useState('');
    const [hostDialogOpen, setHostDialogOpen] = useState(false);
    const [postCmdToHost, { error: errorCmd }] = useMutation(POST_CMD_TO_HOST);

    useEffect(() => {
        if (data) setHostStatus([...data.getHostStatus]);
    }, [data, setHostStatus]);

    const getStatus = (id) => {
        const targetStatusData = hostStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    const handleRefreshClick = useCallback(() => {
        setTimeout(() => refetchStatus(), 0);
    }, [refetchStatus]);

    const handleHostRebootClick = (e, hostId) => {
        setHostId(hostId);
        setMessage(
            '호스트 서버를 재부팅하면 연결된 컨테이너도 모두 종료됩니다. 재부팅 완료 후 연결된 모든 컨테이너가 자동으로 재시작되며, 완전한 재부팅에는 약 3분의 시간이 소요됩니다.',
        );
        setHostDialogOpen(true);
        e.stopPropagation();
    };

    const triggerHostReboot = () => {
        postCmdToHost({
            variables: {
                command: 'reboot',
                hostId,
            },
        });
    };

    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );
    if (errorCmd)
        return (
            <SnackMessage message="권한 없음 - 요청이 거부되었습니다. 에러메시지가 출력됩니다." />
        );

    return (
        <>
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">호스트 ID</TableCell>
                            <TableCell align="center">호스트 이름</TableCell>
                            <TableCell align="center">IP</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">위치</TableCell>
                            <TableCell align="center">
                                {'상태 '}
                                {loading && (
                                    <CircularProgress style={{ width: '14px', height: '14px' }} />
                                )}
                                <RefreshIcon
                                    style={{ fontSize: '14px', cursor: 'pointer' }}
                                    onClick={handleRefreshClick}
                                />
                            </TableCell>
                            <TableCell align="center" width={150}>
                                작업
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hosts.map((row) => (
                            <TableRow
                                key={row.id}
                                onClick={() => handleOpenContainerConsole(row)}
                                className={classes.hostConsoleTableRow}
                            >
                                <TableCell align="center" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.host}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}GB</TableCell>
                                <TableCell align="center">{row.location}</TableCell>
                                <TableCell align="center">
                                    {getStatus(row.id) === 1 ? (
                                        <StatusCircle color="green" />
                                    ) : (
                                        <StatusCircle color="crimson" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Box display="flex" flexDirection="row" justify="center">
                                        <Button
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            onClick={(e) =>
                                                handleHostRebootClick(e, parseInt(row.id))
                                            }
                                        >
                                            재부팅
                                        </Button>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            style={{ marginLeft: 4 }}
                                        >
                                            삭제
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CmdAskDialog
                setHostDialogOpen={setHostDialogOpen}
                hostDialogOpen={hostDialogOpen}
                message={message}
                triggerFunction={triggerHostReboot}
            />
        </>
    );
}
