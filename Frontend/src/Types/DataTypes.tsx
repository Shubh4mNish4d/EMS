export interface EmpDataInterfase {
    _id: string;
        userId: {
            _id: string;
            email: string;
            role: string;
        },
        department: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        position: string;
        basicSalary: number;
        allowances: number;
        deductions: number;
        employeeStatus: string;
        joinDate: string;
        image: null | string;
        isDeleted: boolean;
        bio: string;
        createdAt: string;
        updatedAt: string;
        id: string;
        user: {
            email: string;
            role: string;
        },
}

export interface leaveDataInterface{
        _id: string,
        employeeId: EmpDataInterfase,
        type: string,
        startDate: string,
        endDate: string,
        reason: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        id: string,
}

export interface EmployeeDashboardDataInterface {
    totalDaysPresent: number,
    totalPendingLeaves: number,
    latestPayslip: {
        netSalary: number,
    } | null,
    employee:EmpDataInterfase,
};

export interface AdminDashboardDataInterface {
    role: string,
    totalEmployees: number,
    totalDepartments: number,
    todaysAttendance: number,
    pendingLeaves: number,
};

export interface AttendanceDataInterface{
    _id : string,
    employeeId: string,
    date: string,
    checkIn: string,
    checkOut: string,
    status: string,
    workingHours: number,
    dayType: string,
    createdAt: string,
    updatedAt: string,
}


export interface PayslipDataInterface{
        _id: string,
        employeeId: EmpDataInterfase,
        month: number,
        year: number,
        basicSalary: number,
        allowances: number,
        deductions: number,
        netSalary: number,
        createdAt:string,
        updatedAt: string,
        id: string,
        employee: EmpDataInterfase,
    }

export interface ProfileDataInterface {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    image: null | string,
    role:string
};
