import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Card, Typography, Divider, List } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const AllFeedback = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews/all-feedback');

                // Ensure response.data is an array before setting state
                if (Array.isArray(response.data)) {
                    setFeedbackData(response.data);
                } else {
                    console.error("API response is not an array:", response.data);
                    setFeedbackData([]); // Fallback to empty array
                }

            } catch (error) {
                console.error('Error fetching feedback:', error);
                setFeedbackData([]); // Ensure fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    const columns = [
        {
            title: 'Employee',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary">{record.position}</Text>
                    <br />
                    <Text type="secondary">{record.department}</Text>
                </div>
            ),
        },
        {
            title: 'Performance Score',
            dataIndex: 'score',
            key: 'score',
            render: (score, record) => (
                <div>
                    <Tag color={score >= 10 ? 'green' : score >= 7 ? 'orange' : 'red'}>
                        {score}/{record.maxScore}
                    </Tag>
                    <br />
                    <Text type="secondary">
                        {record.peerReviewCount} peer reviews
                        {record.hasManagerReview && ', 1 manager review'}
                    </Text>
                </div>
            ),
            sorter: (a, b) => a.score - b.score,
        },
        {
            title: 'Strengths',
            dataIndex: 'strengths',
            key: 'strengths',
            render: strengths => (
                <List
                    size="small"
                    dataSource={Array.isArray(strengths) ? strengths : []}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />
            ),
        },
        {
            title: 'Areas for Improvement',
            dataIndex: 'improvementAreas',
            key: 'improvementAreas',
            render: improvements => (
                <List
                    size="small"
                    dataSource={Array.isArray(improvements) ? improvements : []}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />
            ),
        },
        {
            title: 'Suggestions',
            dataIndex: 'suggestions',
            key: 'suggestions',
            render: suggestions => (
                <List
                    size="small"
                    dataSource={Array.isArray(suggestions) ? suggestions : []}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />
            ),
        },
    ];

    return (
        <div className="container">
            <Card>
                <Title level={3}>Employee Performance Feedback</Title>
                <Text type="secondary">
                    Comprehensive analysis of peer and manager reviews
                </Text>
                <Divider />

                <Table
                    columns={columns}
                    dataSource={feedbackData || []}  // Ensure it's always an array
                    rowKey={record => record.employeeId || Math.random()} // Avoid rowKey undefined errors
                    loading={loading}
                    expandable={{
                        expandedRowRender: record => (
                            <div style={{ margin: 0 }}>
                                <Title level={5}>Detailed Feedback</Title>
                                <Divider style={{ margin: '10px 0' }} />

                                <Title level={5}>Manager Review</Title>
                                <Text>{record.managerReview || "No manager review available"}</Text>

                                <Divider style={{ margin: '10px 0' }} />

                                <Title level={5}>Peer Reviews</Title>
                                {Array.isArray(record.peerReviews) && record.peerReviews.length > 0 ? (
                                    <List
                                        dataSource={record.peerReviews}
                                        renderItem={review => (
                                            <List.Item>
                                                <Text>{review.feedback}</Text>
                                                <Tag style={{ marginLeft: 10 }}>
                                                    Score: {review.score}/10
                                                </Tag>
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Text>No peer reviews available</Text>
                                )}
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default AllFeedback;
