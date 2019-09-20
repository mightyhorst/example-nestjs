import {ApiModelProperty} from '@nestjs/swagger';

export class DevicesTableDto {

    @ApiModelProperty({
        required: true,
        description: 'Name of the device'
    })
    name: string;

    @ApiModelProperty({
        required: true,
        description: 'School name'
    })
    schoolName: string;

    @ApiModelProperty({
        required: true,
        description: 'School code'
    })
    schoolCode: string;

    @ApiModelProperty({
        required: true,
        description: 'Network (e.g. Macquarie Park, Ultimo, Wagga Wagga, etc.)'
    })
    network: string;

    @ApiModelProperty({
        required: true,
        description: 'Principal Network (e.g. South Western Sydney)'
    })
    principalNetwork: string;

    @ApiModelProperty({
        required: true,
        description: 'Operating system'
    })
    os: string;

    @ApiModelProperty({
        required: true,
        description: 'Make of the device'
    })
    make: string;

    @ApiModelProperty({
        required: true,
        description: 'Model of device'
    })
    model: string;

    @ApiModelProperty({
        required: true,
        description: 'Serial number of device'
    })
    serialNumber: string;

    @ApiModelProperty({
        required: true,
        description: 'Form factor of the device'
    })
    formFactor: string;

    @ApiModelProperty({
        required: true,
        description: 'Warranty status for the device'
    })
    warrantyStatus: string;

    @ApiModelProperty({
        required: true,
        description: 'Device specification (e.g. Intel i5)'
    })
    spec: string;

    @ApiModelProperty({
        required: true,
        description: 'Device memory (e.g. 4GB RAM)'
    })
    memory: string;

    @ApiModelProperty({
        required: true,
        description: 'Device local disk (e.g. 250GB SSD)'
    })
    localDisk: string;

    @ApiModelProperty({
        required: true,
        description: 'Last logged on user'
    })
    lastLoginUser: string;

    @ApiModelProperty({
        required: true,
        description: 'Last logged on date & time'
    })
    lastLoginDate: string;

    @ApiModelProperty({
        required: true,
        description: 'Age of the device'
    })
    ageOfDevice: string;

    @ApiModelProperty({
        required: true,
        description: 'Utilisation of the device'
    })
    utilisation: string;

    /*
    @ApiModelProperty({
        required: true,
        description: 'Help information'
    })
    helpInfo: string;
    */

    /*
    @ApiModelProperty({
        required: true,
        description: 'Download icon with Label'
    })
    iconUrl: string;
    */


    @ApiModelProperty({
        required: true,
        description: 'Data Context e.g. T4L Devices.'
    })
    dataContext: string;


    constructor(
        name: string,
        schoolName: string,
        schoolCode: string,
        network: string,
        principalNetwork: string,
        os: string,
        make: string,
        model: string,
        serialNumber: string,
        formFactor: string,
        warrantyStatus: string,
        spec: string,
        memory: string,
        localDisk: string,
        lastLoginUser: string,
        lastLoginDate: string,
        ageOfDevice: string,
        utilisation: string,
        dataContext: string
    ) {
        this.name = name;
        this.schoolName = schoolName;
        this.schoolCode = schoolCode;
        this.network = network;
        this.principalNetwork = principalNetwork;
        this.os = os;
        this.make = make;
        this.model = model;
        this.serialNumber = serialNumber;
        this.formFactor = formFactor;
        this.warrantyStatus = warrantyStatus;
        this.spec = spec;
        this.memory = memory;
        this.localDisk = localDisk;
        this.lastLoginUser = lastLoginUser;
        this.lastLoginDate = lastLoginDate;
        this.ageOfDevice = ageOfDevice;
        this.utilisation = utilisation;
        this.dataContext = dataContext;
    }
}

