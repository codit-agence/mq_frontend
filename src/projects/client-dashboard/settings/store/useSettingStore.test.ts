import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '@/src/core/api/axios';
import { tenantService } from '../services/tenant.services';

const mockTenantData = {
  id: 'tenant-1',
  name: 'Test Restaurant',
  slug: 'test-restaurant',
  city: 'Paris',
  business_type: 'restaurant',
  status: 'active',
  created_at: '2026-04-09T00:00:00Z',
  country: 'FR',
  display: {
    template: 'default',
    primary_color: '#000000',
    secondary_color: '#ffffff',
    font_family: 'Inter',
    active_languages: ['fr'],
    default_language: 'fr',
    is_rtl: false,
  },
  business: {
    id: 'business-1',
    name_override: 'Le Test',
    description: 'Restaurant de test',
    logo: 'https://example.com/logo.png',
    cover_image: 'https://example.com/cover.png',
    currency: 'EUR',
    tel: '+33123456789',
    address: '10 rue de la Paix',
    opening_hours: null,
    social_links: { instagram: 'https://instagram.com/test' },
    work_start: null,
    work_end: null,
    show_images: true,
    show_prices: true,
    created_at: '2026-04-09T00:00:00Z',
  },
};

describe('tenantService integration with store', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch tenant settings with X-Tenant-ID header', async () => {
    mock.onGet('/tenants/setting/me').reply((config) => {
      const headers = config.headers as Record<string, any>;
      expect(headers['X-Tenant-ID']).toBe('tenant-1');
      return [200, mockTenantData];
    });

    const result = await tenantService.getMyTenant('tenant-1');

    expect(result).toEqual(mockTenantData);
  });

  it('should update tenant settings with multipart form data and X-Tenant-ID', async () => {
    const updatedData = { ...mockTenantData, name: 'Updated Restaurant' };

    mock.onPost('/tenants/setting/update').reply((config) => {
      const headers = config.headers as Record<string, any>;
      expect(headers['X-Tenant-ID']).toBe('tenant-1');
      expect(headers['Content-Type']).toContain('multipart/form-data');
      return [200, updatedData];
    });

    const formData = new FormData();
    formData.append('name', 'Updated Restaurant');

    const result = await tenantService.updateTenant(formData, 'tenant-1');

    expect(result).toEqual(updatedData);
  });

  it('should work without tenant ID (uses default from auth interceptor)', async () => {
    mock.onGet('/tenants/setting/me').reply(200, mockTenantData);

    const result = await tenantService.getMyTenant();

    expect(result).toEqual(mockTenantData);
  });

  it('should handle file uploads in form data', async () => {
    const file = new File(['test'], 'logo.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('name', 'Test Restaurant');
    formData.append('logo_file', file);

    mock.onPost('/tenants/setting/update').reply((config) => {
      const headers = config.headers as Record<string, any>;
      expect(headers['X-Tenant-ID']).toBe('tenant-1');
      expect(headers['Content-Type']).toContain('multipart/form-data');
      expect(config.data).toBeTruthy();
      return [200, mockTenantData];
    });

    const result = await tenantService.updateTenant(formData, 'tenant-1');

    expect(result).toEqual(mockTenantData);
  });
});
