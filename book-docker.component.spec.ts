import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDockerComponent } from './book-docker.component';

describe('BookDockerComponent', () => {
  let component: BookDockerComponent;
  let fixture: ComponentFixture<BookDockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDockerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookDockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
