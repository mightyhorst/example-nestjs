export enum DeviceOSType {
    Workstation = 'Workstation'
}

/**
 * This interface represents a single device from the ElasticSearch index `ict_plus_device_data`.
 */
export interface IDevice {
    device_name: string;
    device_specification: string;
    form_factor: string;
    free_hdd_size_gb: number;
    hdd_size_gb: number;
    last_logon_timestamp?: string;
    last_logon_user?: string;
    manufacturer: string;
    model: string;
    operating_system: string;
    os_service_pack: string;
    ostype: string;
    release_year: string;
    serialnumber: string;
    site_name: string;
    sitecode: string;
    total_memory_mb: number;
    warranty: string;
}
