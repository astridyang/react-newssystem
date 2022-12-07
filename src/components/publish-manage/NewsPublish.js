import { Table} from "antd";
import React from "react";

export default function NewsPublish(props) {
    const columns = [
        {
            title: "Title",
            dataIndex: "label",
        },
        {
            title: "Author",
            dataIndex: "author",
        },
        {
            title: "Category",
            dataIndex: "category",
            render(category) {
                return category.label;
            },
        },
        {
            title: "Operation",
            render(item) {
                return (
                    <div>
                        {props.button(item.id)}
                    </div>
                );
            },
        },
    ];
    return (
        <div>
            <Table
                dataSource={props.dataSource}
                columns={columns}
                pagination={{pageSize: 10}}
                rowKey={(item) => item.id}
            />
        </div>
    );
}
