import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import api from '@/src/core/api/axios';
import { tenantService } from './tenant.services';

const tenantPayload = {
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

describe('tenantService', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch tenant settings using the tenant endpoint', async () => {
    mock.onGet('/tenants/setting/me').reply(200, tenantPayload);

    const result = await tenantService.getMyTenant('tenant-1');

    expect(result).toEqual(tenantPayload);
  });

  it('should send multipart update with X-Tenant-ID header', async () => {
    const updatedPayload = {
      ...tenantPayload,
      name: 'Test Restaurant Updated',
    };

    mock.onPost('/tenants/setting/update').reply((config) => {
      const headers = config.headers as Record<string, string>;
      expect(headers['X-Tenant-ID']).toBe('tenant-1');
      expect(headers['Content-Type']).toContain('multipart/form-data');
      return [200, updatedPayload];
    });

    const formData = new FormData();
    formData.append('name', 'Test Restaurant Updated');

    const result = await tenantService.updateTenant(formData, 'tenant-1');

    expect(result).toEqual(updatedPayload);
  });
});
