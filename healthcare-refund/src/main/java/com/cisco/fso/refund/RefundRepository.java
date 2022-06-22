package com.cisco.fso.refund;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface RefundRepository extends JpaRepository<Refund, Integer>{
    
}


