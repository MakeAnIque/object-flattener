export declare const DOCUMENT_TYPE_2: {
    company: {
        name: string;
        departments: ({
            name: string;
            manager: {
                name: string;
                employeeId: string;
                contact: {
                    email: string;
                    phone: string;
                };
                address: {
                    street: string;
                    city: string;
                    state: string;
                    zip: string;
                };
            };
            teams: {
                name: string;
                lead: {
                    name: string;
                    employeeId: string;
                };
                projects: {
                    projectId: string;
                    name: string;
                    status: string;
                    tasks: {
                        taskId: string;
                        description: string;
                        assignedTo: {
                            name: string;
                            employeeId: string;
                        };
                        dueDate: string;
                    }[];
                }[];
            }[];
        } | {
            name: string;
            manager: {
                name: string;
                employeeId: string;
                contact: {
                    email: string;
                    phone: string;
                };
                address: {
                    street: string;
                    city: string;
                    state: string;
                    zip: string;
                };
            };
            teams: {
                name: string;
                lead: {
                    name: string;
                    employeeId: string;
                };
                campaigns: {
                    campaignId: string;
                    name: string;
                    status: string;
                    tasks: {
                        taskId: string;
                        description: string;
                        assignedTo: {
                            name: string;
                            employeeId: string;
                        };
                        dueDate: string;
                    }[];
                    tasksLog: {
                        taskId: string;
                        description: string;
                        assignedTo: {
                            name: string;
                            employeeId: string;
                        };
                        dueDate: string;
                    }[];
                }[];
            }[];
        })[];
    };
};
