<template>
  <div>
    <el-container>
      <el-aside width="100px">
        <el-row>
          <div>강의중인 과목 목록</div>
        </el-row>
      </el-aside>
      <el-main class="main-box">
        <el-header>
          <el-row>
            <el-col :span="24"><div class="lecture-number-name">4강 (배열)</div></el-col>
          </el-row>  
        </el-header>
        
        <el-row :gutter="30">
          <el-col :span="16">
            <div class="scenario bg-purple">시퀀스 들이 배열되는 공간</div>
          </el-col>
          <el-col :span="8">
            <div class="scenario bg-purple-light sequence-method">
              <el-main>
                <div class="method-list"></div>
              </el-main>
              <el-footer class="method-list-message" height="10px">
                시퀀스 제작 도구
              </el-footer>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <div class="item-config-box bg-purple-dark">
              <el-header>
                <div class="lecture-number-name">새 문항 입력하기</div>
              </el-header>
              <el-main>
                  <div>문항에 관련된 사항 입력 공간</div>
              </el-main>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item-config-box bg-purple-dark">
              <el-header>
                <div class="lecture-number-name">활성화 방식</div>
              </el-header>
              <el-main>
                  <div></div>
              </el-main>
            </div>
          </el-col>
        </el-row>       
      </el-main>
    </el-container>
    
  </div>
</template>

<style>
  .el-footer {
    height: 10px;
  }
  .method-list-message {
     min-height: 20px;
     text-align: center;
  }
  .method-list {
    min-height: 100px;
  }
  .lecture-number-name {
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: darkorange;
  }
  .main-box {
    background: #dedfe0;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .scenario {
    min-height: 150px;
  }
  .sequence-method {
    border-style: dashed;
  }
  .bg-purple-dark {
    background: #9aabc2;
  }
  .subject-list {
    width: 20px;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .item-config-box {
    min-height: 400px;
    padding-top: 15px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>